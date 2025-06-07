package com.ykhyyy.friend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ykhyyy.api.neo4j.FriendNeo4j;
import com.ykhyyy.common.util.Result;
import com.ykhyyy.friend.domain.entity.FriendRelation;

import java.util.List;

/**
 * 好友关系服务接口
 */
public interface FriendRelationService extends IService<FriendRelation> {
    
    /**
     * 更新好友关系状态
     * @param id 关系ID
     * @param status 状态值
     * @return 操作结果
     */
    Result<Void> updateStatus(Long id, Integer status);
    
    /**
     * 删除好友关系
     * @param id 关系ID
     * @return 操作结果
     */
    Result<Void> delFriend(Long id);
    
    /**
     * 获取可能认识的人
     * @param userId 用户ID
     * @return 可能认识的人列表
     */
    Result<List<FriendNeo4j>> maybeKnowFriendRelation(Long userId);
} 