# 用户端API接口文档

## 用户管理



### 微信登录接口
- **URL**: `/api/user/wxlogin`
- **方法**: POST
- **参数**: 微信授权code
- **返回**: 登录成功后的用户信息和token


## AI功能


### 流式对话接口
- **URL**: `/api/ai/stream/chat`
- **方法**: POST
- **参数**:
  ```json
  {
    "prompt": "用户问题",
    "userId": "用户ID"
  }
  ```
- **返回**: 流式返回AI回复的文本内容

### 获取用户的所有会话
- **URL**: `/api/ai/history`
- **方法**: GET
- **参数**: userId=用户ID
- **返回**: 用户的所有AI对话会话列表

### 获取会话内的聊天记录
- **URL**: `/api/ai/history/message`
- **方法**: GET
- **参数**: chatSessionId=会话ID
- **返回**: 指定会话的聊天记录列表

### 智能商品推荐接口
- **URL**: `/api/ai/openFeign/shopRecommend/{userId}`
- **方法**: POST
- **参数**: 商品列表，用户ID
- **返回**: 推荐的商品列表

## 优惠券功能

### 秒杀优惠券
- **URL**: `/api/coupon/speedKill`
- **方法**: POST
- **参数**:
  ```json
  {
    "userId": "用户ID",
    "couponId": "优惠券ID"
  }
  ```
- **返回**: 秒杀结果

### 获取优惠券详情
- **URL**: `/api/coupon/{id}`
- **方法**: GET
- **参数**: 优惠券ID
- **返回**: 优惠券详细信息

## 代取任务功能

### 创建快递订单
- **URL**: `/api/express`
- **方法**: POST
- **参数**:
  ```json
  {
    "pickupAddress": "取件地址",
    "deliveryAddress": "送达地址",
    "publisherId": "发布者ID",
    "publisherPhone": "发布者电话",
    "price": "订单价格"
  }
  ```
- **返回**: 创建的快递订单信息

### 获取快递订单详情
- **URL**: `/api/express/{id}`
- **方法**: GET
- **参数**: 订单ID
- **返回**: 快递订单详细信息

### 更新快递订单信息
- **URL**: `/api/express/{id}`
- **方法**: PUT
- **参数**: 订单ID，更新的订单信息
- **返回**: 更新后的快递订单信息

### 删除快递订单
- **URL**: `/api/express/{id}`
- **方法**: DELETE
- **参数**: 订单ID
- **返回**: 删除结果

### 分页查询快递订单
- **URL**: `/api/express/page`
- **方法**: GET
- **参数**:
  - current: 当前页码
  - size: 每页数量
  - userId: 用户ID（可选）
- **返回**: 分页的快递订单列表

## 好友功能

### 添加好友关系
- **URL**: `/api/friend/relation/add`
- **方法**: POST
- **参数**:
  ```json
  {
    "userId": "用户ID",
    "friendId": "好友ID"
  }
  ```
- **返回**: 创建的好友关系信息

### 获取用户的好友列表
- **URL**: `/api/friend/relation/list/{userId}`
- **方法**: GET
- **参数**:
  - userId: 用户ID
  - status: 好友状态（可选）
  - page: 页码
  - pageSize: 每页数量
- **返回**: 用户的好友列表

### 获取好友申请列表
- **URL**: `/api/friend/relation/requests/{userId}`
- **方法**: GET
- **参数**:
  - userId: 用户ID
  - page: 页码
  - pageSize: 每页数量
- **返回**: 用户收到的好友申请列表

### 更新好友关系状态
- **URL**: `/api/friend/relation/status/{id}`
- **方法**: PUT
- **参数**:
  - id: 好友关系ID
  - status: 状态值（0申请中，1已同意，2已拒绝）
- **返回**: 更新结果

### 删除好友关系
- **URL**: `/api/friend/relation/{id}`
- **方法**: DELETE
- **参数**: 好友关系ID
- **返回**: 删除结果

### 检查是否为好友关系
- **URL**: `/api/friend/relation/check`
- **方法**: GET
- **参数**:
  - userId: 用户ID
  - friendId: 好友ID
- **返回**: 是否为好友的布尔值

### 可能认识的人
- **URL**: `/api/friend/relation/maybeKnow`
- **方法**: GET
- **参数**: userId=用户ID
- **返回**: 可能认识的人列表

## 聊天功能

### 发送消息
- **URL**: `/api/friend/chat/message/send`
- **方法**: POST
- **参数**:
  ```json
  {
    "senderId": "发送者ID",
    "receiverId": "接收者ID",
    "content": "消息内容",
    "messageType": "消息类型"
  }
  ```
- **返回**: 发送的消息信息

### 获取聊天记录
- **URL**: `/api/friend/chat/message/list`
- **方法**: GET
- **参数**:
  - senderId: 发送者ID
  - receiverId: 接收者ID
  - page: 页码
  - pageSize: 每页数量
- **返回**: 聊天记录列表

### 创建或更新会话
- **URL**: `/api/friend/chat/session/save`
- **方法**: POST
- **参数**:
  ```json
  {
    "userId": "用户ID",
    "friendId": "好友ID",
    "lastMessage": "最后一条消息",
    "unreadCount": "未读消息数"
  }
  ```
- **返回**: 创建或更新的会话信息

### 获取用户的所有会话列表
- **URL**: `/api/friend/chat/session/list/{userId}`
- **方法**: GET
- **参数**:
  - userId: 用户ID
  - page: 页码
  - pageSize: 每页数量
- **返回**: 用户的会话列表

### 获取单个会话
- **URL**: `/api/friend/chat/session/{id}`
- **方法**: GET
- **参数**: 会话ID
- **返回**: 会话详情

### 更新未读消息数
- **URL**: `/api/friend/chat/session/unread`
- **方法**: PUT
- **参数**:
  - userId: 用户ID
  - friendId: 好友ID
  - count: 未读消息数
- **返回**: 更新结果

### 删除会话
- **URL**: `/api/friend/chat/session/{id}`
- **方法**: DELETE
- **参数**: 会话ID
- **返回**: 删除结果

## 帖子功能

### 创建帖子
- **URL**: `/api/post`
- **方法**: POST
- **参数**:
  ```json
  {
    "userId": "用户ID",
    "title": "帖子标题",
    "content": "帖子内容",
    "imgs": "图片URL列表"
  }
  ```
- **返回**: 创建的帖子信息

### 获取帖子详情
- **URL**: `/api/post/{id}`
- **方法**: GET
- **参数**: 帖子ID
- **返回**: 帖子详细信息

### 更新帖子信息
- **URL**: `/api/post/{id}`
- **方法**: PUT
- **参数**: 帖子ID，更新的帖子信息
- **返回**: 更新后的帖子信息

### 获取热门帖子
- **URL**: `/api/post/hot`
- **方法**: GET
- **返回**: 热门帖子列表

### 删除帖子
- **URL**: `/api/post/{id}`
- **方法**: DELETE
- **参数**: 帖子ID
- **返回**: 删除结果

### 创建帖子评论
- **URL**: `/api/post-comment`
- **方法**: POST
- **参数**:
  ```json
  {
    "postId": "帖子ID",
    "userId": "用户ID",
    "content": "评论内容"
  }
  ```
- **返回**: 创建的评论信息

### 删除帖子评论
- **URL**: `/api/post-comment/{id}`
- **方法**: DELETE
- **参数**: 评论ID
- **返回**: 删除结果

### 分页查询帖子评论
- **URL**: `/api/post-comment/page`
- **方法**: GET
- **参数**:
  - current: 当前页码
  - size: 每页数量
  - postId: 帖子ID（可选）
- **返回**: 分页的评论列表

## 探店功能

### 创建探店
- **URL**: `/api/shop-review`
- **方法**: POST
- **参数**:
  ```json
  {
    "shopId": "店铺ID",
    "userId": "用户ID",
    "title": "标题",
    "content": "内容",
    "imgs": "图片URL列表",
    "video": "视频URL"
  }
  ```
- **返回**: 创建的探店信息

### 获取探店详情
- **URL**: `/api/shop-review/{id}`
- **方法**: GET
- **参数**: 探店ID
- **返回**: 探店详细信息

### 更新探店信息
- **URL**: `/api/shop-review/{id}`
- **方法**: PUT
- **参数**: 探店ID，更新的探店信息
- **返回**: 更新后的探店信息

### 删除探店
- **URL**: `/api/shop-review/{id}`
- **方法**: DELETE
- **参数**: 探店ID
- **返回**: 删除结果

### 分页查询探店
- **URL**: `/api/shop-review/page`
- **方法**: GET
- **参数**:
  - current: 当前页码
  - size: 每页数量
  - shopId: 店铺ID（可选）
  - userId: 用户ID（可选）
- **返回**: 分页的探店列表

### 创建探店评论
- **URL**: `/api/shop-review-comment`
- **方法**: POST
- **参数**:
  ```json
  {
    "reviewId": "探店ID",
    "userId": "用户ID",
    "content": "评论内容"
  }
  ```
- **返回**: 创建的评论信息

### 删除探店评论
- **URL**: `/api/shop-review-comment/{id}`
- **方法**: DELETE
- **参数**: 评论ID
- **返回**: 删除结果

### 分页查询探店评论
- **URL**: `/api/shop-review-comment/page`
- **方法**: GET
- **参数**:
  - current: 当前页码
  - size: 每页数量
  - reviewId: 探店ID（可选）
  - userId: 用户ID（可选）
- **返回**: 分页的评论列表

### 获取探店的所有评论
- **URL**: `/api/shop-review-comment/review/{reviewId}`
- **方法**: GET
- **参数**: 探店ID
- **返回**: 探店的所有评论列表

## 商品功能

### 获取店铺商品详情
- **URL**: `/api/shop-product/{id}`
- **方法**: GET
- **参数**: 商品ID
- **返回**: 商品详细信息

### 分页查询店铺商品
- **URL**: `/api/shop-product/page`
- **方法**: GET
- **参数**:
  - current: 当前页码
  - size: 每页数量
  - shopId: 店铺ID（可选）
  - categoryId: 分类ID（可选）
- **返回**: 分页的商品列表

### 获取商品分类详情
- **URL**: `/api/shop-product-category/{id}`
- **方法**: GET
- **参数**: 分类ID
- **返回**: 分类详细信息

### 分页查询商品分类
- **URL**: `/api/shop-product-category/page`
- **方法**: GET
- **参数**:
  - current: 当前页码
  - size: 每页数量
  - shopId: 店铺ID（可选）
- **返回**: 分页的分类列表

### 获取店铺的所有商品分类
- **URL**: `/api/shop-product-category/shop/{shopId}`
- **方法**: GET
- **参数**: 店铺ID
- **返回**: 店铺的所有商品分类列表

## 订单功能

### 创建订单
- **URL**: `/api/order/create`
- **方法**: POST
- **参数**:
  ```json
  {
    "order": {
      "userId": "用户ID",
      "shopId": "店铺ID",
      "address": "收货地址",
      "phone": "联系电话",
      "totalAmount": "总金额"
    },
    "orderItems": [
      {
        "productId": "商品ID",
        "productName": "商品名称",
        "productPrice": "商品价格",
        "quantity": "购买数量"
      }
    ]
  }
  ```
- **返回**: 创建的订单信息

### 获取订单详情
- **URL**: `/api/order/detail`
- **方法**: GET
- **参数**:
  - orderId: 订单ID
  - userId: 用户ID
- **返回**: 订单详细信息

### 获取用户所有订单
- **URL**: `/api/order/user/{userId}`
- **方法**: GET
- **参数**: 用户ID
- **返回**: 用户的所有订单列表

### 分页查询用户订单
- **URL**: `/api/order/user/{userId}/page`
- **方法**: GET
- **参数**:
  - userId: 用户ID
  - current: 当前页码
  - size: 每页数量
  - status: 订单状态（可选）
- **返回**: 分页的订单列表

### 取消订单
- **URL**: `/api/order/{userId}/{orderId}/cancel`
- **方法**: PUT
- **参数**:
  - userId: 用户ID
  - orderId: 订单ID
- **返回**: 取消结果

### 支付订单
- **URL**: `/api/order/{userId}/{orderId}/pay`
- **方法**: PUT
- **参数**:
  - userId: 用户ID
  - orderId: 订单ID
- **返回**: 支付结果

### 完成订单
- **URL**: `/api/order/{userId}/{orderId}/complete`
- **方法**: PUT
- **参数**:
  - userId: 用户ID
  - orderId: 订单ID
- **返回**: 完成结果

## 图片上传

### 上传文件到OSS
- **URL**: `/api/upload`
- **方法**: POST
- **参数**: 文件（MultipartFile）
- **返回**: 上传成功后的文件URL
