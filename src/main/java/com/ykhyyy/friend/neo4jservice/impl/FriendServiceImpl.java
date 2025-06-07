package com.ykhyyy.friend.neo4jservice.impl;

import com.ykhyyy.api.neo4j.FriendNeo4j;
import com.ykhyyy.friend.neo4jservice.FriendService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.TransactionWork;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Neo4j好友服务实现类
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FriendServiceImpl implements FriendService {

    private final Driver neo4jDriver;

    /**
     * 保存好友节点
     *
     * @param friend 好友节点
     */
    @Override
    public void save(FriendNeo4j friend) {
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction((TransactionWork<Void>) tx -> {
                String query = "MERGE (f:Friend {id: $id}) " +
                        "ON CREATE SET f.name = $name, f.avatar = $avatar " +
                        "ON MATCH SET f.name = $name, f.avatar = $avatar";
                
                Map<String, Object> params = Map.of(
                        "id", friend.getId(),
                        "name", friend.getName(),
                        "avatar", friend.getAvatar() != null ? friend.getAvatar() : ""
                );
                
                tx.run(query, params);
                return null;
            });
        } catch (Exception e) {
            log.error("保存Neo4j好友节点失败: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * 创建好友关系
     *
     * @param userId 用户ID
     * @param friendId 好友ID
     */
    @Override
    public void createFriendRelation(Long userId, Long friendId) {
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction((TransactionWork<Void>) tx -> {
                // 确保节点存在
                String createNodesQuery = "MERGE (u:Friend {id: $userId}) " +
                        "MERGE (f:Friend {id: $friendId})";
                
                tx.run(createNodesQuery, Map.of(
                        "userId", userId,
                        "friendId", friendId
                ));
                
                // 创建关系
                String createRelationQuery = "MATCH (u:Friend {id: $userId}), (f:Friend {id: $friendId}) " +
                        "MERGE (u)-[:FRIEND]->(f)";
                
                tx.run(createRelationQuery, Map.of(
                        "userId", userId,
                        "friendId", friendId
                ));
                
                return null;
            });
        } catch (Exception e) {
            log.error("创建Neo4j好友关系失败: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * 删除好友关系
     *
     * @param userId 用户ID
     * @param friendId 好友ID
     */
    @Override
    public void deleteFriendRelation(Long userId, Long friendId) {
        try (Session session = neo4jDriver.session()) {
            session.writeTransaction((TransactionWork<Void>) tx -> {
                String query = "MATCH (u:Friend {id: $userId})-[r:FRIEND]->(f:Friend {id: $friendId}) " +
                        "DELETE r";
                
                tx.run(query, Map.of(
                        "userId", userId,
                        "friendId", friendId
                ));
                
                // 删除反向关系
                String reverseQuery = "MATCH (f:Friend {id: $friendId})-[r:FRIEND]->(u:Friend {id: $userId}) " +
                        "DELETE r";
                
                tx.run(reverseQuery, Map.of(
                        "userId", userId,
                        "friendId", friendId
                ));
                
                return null;
            });
        } catch (Exception e) {
            log.error("删除Neo4j好友关系失败: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * 查找可能认识的朋友
     * 通过好友的好友关系查找
     *
     * @param userId 用户ID
     * @return 可能认识的人列表
     */
    @Override
    public List<FriendNeo4j> findMaybeKnownFriends(Long userId) {
        try (Session session = neo4jDriver.session()) {
            return session.readTransaction((TransactionWork<List<FriendNeo4j>>) tx -> {
                // 查找二度关系中尚未成为好友的用户
                String query = "MATCH (u:Friend {id: $userId})-[:FRIEND]->(f:Friend)-[:FRIEND]->(fof:Friend) " +
                        "WHERE NOT (u)-[:FRIEND]->(fof) AND u.id <> fof.id " +
                        "RETURN fof.id as id, fof.name as name, fof.avatar as avatar, count(*) as commonFriends " +
                        "ORDER BY commonFriends DESC LIMIT 10";
                
                Result result = tx.run(query, Map.of("userId", userId));
                
                List<FriendNeo4j> maybeKnownList = new ArrayList<>();
                result.forEachRemaining(record -> {
                    FriendNeo4j friend = new FriendNeo4j();
                    friend.setId(record.get("id").asLong());
                    friend.setName(record.get("name").asString());
                    
                    if (!record.get("avatar").isNull()) {
                        friend.setAvatar(record.get("avatar").asString());
                    }
                    
                    // 额外设置共同好友数量
                    friend.setCommonFriends(record.get("commonFriends").asInt());
                    
                    maybeKnownList.add(friend);
                });
                
                return maybeKnownList;
            });
        } catch (Exception e) {
            log.error("获取可能认识的人失败: {}", e.getMessage());
            throw e;
        }
    }
} 