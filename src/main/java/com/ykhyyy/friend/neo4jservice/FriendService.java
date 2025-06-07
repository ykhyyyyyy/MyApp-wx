package com.ykhyyy.friend.neo4jservice;

import com.ykhyyy.api.neo4j.FriendNeo4j;

import java.util.List;

/**
 * Neo4j好友服务接口
 */
public interface FriendService {
    
    /**
     * 保存好友节点
     * 
     * @param friend 好友节点
     */
    void save(FriendNeo4j friend);
    
    /**
     * 创建好友关系
     * 
     * @param userId 用户ID
     * @param friendId 好友ID
     */
    void createFriendRelation(Long userId, Long friendId);
    
    /**
     * 删除好友关系
     * 
     * @param userId 用户ID
     * @param friendId 好友ID
     */
    void deleteFriendRelation(Long userId, Long friendId);
    
    /**
     * 查找可能认识的朋友
     * 通过好友的好友关系查找
     * 
     * @param userId 用户ID
     * @return 可能认识的人列表
     */
    List<FriendNeo4j> findMaybeKnownFriends(Long userId);
} 