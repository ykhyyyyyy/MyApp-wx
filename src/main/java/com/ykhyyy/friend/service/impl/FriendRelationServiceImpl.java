package com.ykhyyy.friend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ykhyyy.api.neo4j.FriendNeo4j;
import com.ykhyyy.common.util.Result;
import com.ykhyyy.friend.domain.entity.FriendRelation;
import com.ykhyyy.friend.mapper.FriendRelationMapper;
import com.ykhyyy.friend.neo4jservice.FriendService;
import com.ykhyyy.friend.service.FriendRelationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 好友关系服务实现类
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FriendRelationServiceImpl extends ServiceImpl<FriendRelationMapper, FriendRelation> implements FriendRelationService {

    private final FriendService friendService;

    /**
     * 更新好友关系状态
     * @param id 关系ID
     * @param status 状态值
     * @return 操作结果
     */
    @Override
    @Transactional
    public Result<Void> updateStatus(Long id, Integer status) {
        // 检查id是否有效
        if (id == null || status == null) {
            return Result.error("参数无效");
        }
        
        // 获取好友关系
        FriendRelation relation = getById(id);
        if (relation == null) {
            return Result.error("好友关系不存在");
        }
        
        // 更新状态
        relation.setStatus(status);
        relation.setUpdateTime(LocalDateTime.now());
        boolean updated = updateById(relation);
        
        if (!updated) {
            return Result.error("更新状态失败");
        }
        
        // 如果状态为接受(1)，则创建双向好友关系
        if (status == 1) {
            // 检查是否已存在对方到自己的好友关系
            LambdaQueryWrapper<FriendRelation> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(FriendRelation::getUserId, relation.getFriendId())
                    .eq(FriendRelation::getFriendId, relation.getUserId());
            
            FriendRelation reverseRelation = getOne(queryWrapper);
            
            // 如果不存在，则创建
            if (reverseRelation == null) {
                FriendRelation newReverseRelation = new FriendRelation();
                newReverseRelation.setUserId(relation.getFriendId());
                newReverseRelation.setFriendId(relation.getUserId());
                newReverseRelation.setStatus(1); // 已接受
                newReverseRelation.setCreateTime(LocalDateTime.now());
                newReverseRelation.setUpdateTime(LocalDateTime.now());
                
                boolean saved = save(newReverseRelation);
                if (!saved) {
                    return Result.error("创建双向好友关系失败");
                }
            } else if (reverseRelation.getStatus() != 1) {
                // 如果存在但状态不是已接受，则更新
                reverseRelation.setStatus(1);
                reverseRelation.setUpdateTime(LocalDateTime.now());
                updateById(reverseRelation);
            }
            
            // 在图数据库中创建好友关系
            try {
                // 创建好友关系节点
                friendService.createFriendRelation(relation.getUserId(), relation.getFriendId());
            } catch (Exception e) {
                // 记录错误但不影响主流程
                log.error("创建Neo4j好友关系失败: {}", e.getMessage());
            }
        }
        
        return Result.success();
    }

    /**
     * 删除好友关系
     * @param id 关系ID
     * @return 操作结果
     */
    @Override
    @Transactional
    public Result<Void> delFriend(Long id) {
        // 检查id是否有效
        if (id == null) {
            return Result.error("参数无效");
        }
        
        // 获取好友关系
        FriendRelation relation = getById(id);
        if (relation == null) {
            return Result.error("好友关系不存在");
        }
        
        // 删除该好友关系
        boolean removed = removeById(id);
        if (!removed) {
            return Result.error("删除好友关系失败");
        }
        
        // 查找并删除反向的好友关系
        LambdaQueryWrapper<FriendRelation> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(FriendRelation::getUserId, relation.getFriendId())
                .eq(FriendRelation::getFriendId, relation.getUserId());
        
        FriendRelation reverseRelation = getOne(queryWrapper);
        if (reverseRelation != null) {
            removeById(reverseRelation.getId());
        }
        
        // 删除Neo4j中的好友关系
        try {
            // 删除图数据库中的好友关系
            friendService.deleteFriendRelation(relation.getUserId(), relation.getFriendId());
        } catch (Exception e) {
            // 记录错误但不影响主流程
            log.error("删除Neo4j好友关系失败: {}", e.getMessage());
        }
        
        return Result.success();
    }

    /**
     * 获取可能认识的人
     * @param userId 用户ID
     * @return 可能认识的人列表
     */
    @Override
    public Result<List<FriendNeo4j>> maybeKnowFriendRelation(Long userId) {
        if (userId == null) {
            return Result.error("用户ID不能为空");
        }
        
        try {
            // 从Neo4j图数据库获取可能认识的人
            List<FriendNeo4j> maybeKnowList = friendService.findMaybeKnownFriends(userId);
            return Result.success(maybeKnowList);
        } catch (Exception e) {
            // 记录错误
            log.error("获取可能认识的人失败: {}", e.getMessage());
            return Result.error("获取可能认识的人失败");
        }
    }
} 