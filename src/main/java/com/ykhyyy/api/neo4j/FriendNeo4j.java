package com.ykhyyy.api.neo4j;

import lombok.Data;

/**
 * Neo4j好友节点模型
 */
@Data
public class FriendNeo4j {
    
    /**
     * 用户ID
     */
    private Long id;
    
    /**
     * 用户名称
     */
    private String name;
    
    /**
     * 用户头像
     */
    private String avatar;
    
    /**
     * 共同好友数量
     */
    private Integer commonFriends;
} 