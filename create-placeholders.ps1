# PowerShell script to create decoration placeholder files

# Create placeholder files for Chinese-style decorative elements
echo "/* 标题左侧装饰占位符 */" > static/decoration/title-left.png
echo "/* 标题右侧装饰占位符 */" > static/decoration/title-right.png
echo "/* 标题图标装饰占位符 */" > static/decoration/title-icon.png
echo "/* 中国结左侧装饰占位符 */" > static/decoration/chinese-knot-left.png
echo "/* 中国结右侧装饰占位符 */" > static/decoration/chinese-knot-right.png
echo "/* 边角装饰图案占位符 */" > static/decoration/corner-decoration.png
echo "/* 竹子边角装饰占位符 */" > static/decoration/bamboo-corner.png
echo "/* 头像框装饰占位符 */" > static/decoration/avatar-frame.png
echo "/* 加载动画占位符 */" > static/decoration/loading.png
echo "/* 云纹背景占位符 */" > static/decoration/cloud-pattern.png

# Create placeholder directories for images
mkdir -p static/images/avatars
mkdir -p static/images/posts
mkdir -p static/images/products

# Create placeholder product images
echo "/* 产品图片占位符：T恤 */" > static/images/products/tshirt.png
echo "/* 产品图片占位符：笔记本电脑 */" > static/images/products/laptop.png
echo "/* 产品图片占位符：书籍 */" > static/images/products/books.png
echo "/* 产品图片占位符：笔记本 */" > static/images/products/notebook.png
echo "/* 产品图片占位符：耳机 */" > static/images/products/earphones.png
echo "/* 产品图片占位符：杯子 */" > static/images/products/cup.png
echo "/* 产品图片占位符：书签 */" > static/images/products/bookmark.png

# Create placeholder user avatars
echo "/* 用户头像占位符1 */" > static/images/avatars/user1.png
echo "/* 用户头像占位符2 */" > static/images/avatars/user2.png
echo "/* 用户头像占位符3 */" > static/images/avatars/user3.png

# Create placeholder banner images
echo "/* 商城横幅占位符1 */" > static/images/mall-banner1.png
echo "/* 商城横幅占位符2 */" > static/images/mall-banner2.png

# Create placeholder nav background images
echo "/* 论坛导航背景占位符 */" > static/images/nav-forum.png
echo "/* 商城导航背景占位符 */" > static/images/nav-mall.png
echo "/* 用户中心导航背景占位符 */" > static/images/nav-user.png
echo "/* 探店导航背景占位符 */" > static/images/nav-explore.png

# Create placeholder icons directory
mkdir -p static/icons

# Create placeholder menu icons
echo "/* 地址图标占位符 */" > static/icons/menu-address.png
echo "/* 优惠券图标占位符 */" > static/icons/menu-coupon.png
echo "/* 探店图标占位符 */" > static/icons/menu-explore.png
echo "/* 设置图标占位符 */" > static/icons/menu-setting.png
echo "/* 反馈图标占位符 */" > static/icons/menu-feedback.png
echo "/* 关于图标占位符 */" > static/icons/menu-about.png

# Create placeholder order icons
echo "/* 未付款图标占位符 */" > static/icons/order-unpaid.png
echo "/* 未发货图标占位符 */" > static/icons/order-unshipped.png
echo "/* 已发货图标占位符 */" > static/icons/order-shipped.png
echo "/* 已完成图标占位符 */" > static/icons/order-completed.png

# Create placeholder category icons
echo "/* 美食分类图标占位符 */" > static/icons/cat-food.png
echo "/* 书籍分类图标占位符 */" > static/icons/cat-book.png
echo "/* 服饰分类图标占位符 */" > static/icons/cat-clothing.png
echo "/* 数码分类图标占位符 */" > static/icons/cat-digital.png

# Create other common icons
echo "/* 搜索图标占位符 */" > static/icons/search.png
echo "/* 右箭头图标占位符 */" > static/icons/arrow-right.png
echo "/* 写作图标占位符 */" > static/icons/write.png
echo "/* 浏览图标占位符 */" > static/icons/eye.png
echo "/* 评论图标占位符 */" > static/icons/comment.png
echo "/* 点赞图标占位符 */" > static/icons/like.png

Write-Host "所有占位文件创建完成！" 