package com.ykhyyy.friend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ykhyyy.friend.domain.entity.FriendRelation;
import org.apache.ibatis.annotations.Mapper;

/**
 * 好友关系Mapper接口
 */
@Mapper
public interface FriendRelationMapper extends BaseMapper<FriendRelation> {
} 