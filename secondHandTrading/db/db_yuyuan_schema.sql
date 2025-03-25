/*
 Navicat Premium Data Transfer

 Source Server         : MyHuaWeiCloud
 Source Server Type    : MySQL
 Source Server Version : 80041
 Source Host           : 60.204.159.70:3306
 Source Schema         : db_yuyuan

 Target Server Type    : MySQL
 Target Server Version : 80041
 File Encoding         : 65001

 Date: 26/03/2025 04:33:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键id，自增',
  `product_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '产品编码',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL COMMENT '评论内容',
  `add_time` datetime NULL DEFAULT NULL COMMENT '生成时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否已经删除',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名称',
  `user_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '用户账户',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '产品名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id，主键',
  `item_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '字段名称',
  `item_value` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '字段的值',
  `add_date` datetime NULL DEFAULT NULL COMMENT '新增时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `item_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '字段的编码',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否已经被删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for login_record
-- ----------------------------
DROP TABLE IF EXISTS `login_record`;
CREATE TABLE `login_record`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键id，自增',
  `user_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '账户',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '用户',
  `client_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '客户登录的客户端ip地址',
  `inputpass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '输入的密码',
  `headers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL COMMENT 'header中的信息',
  `add_time` datetime NULL DEFAULT NULL COMMENT '数据创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '数据更新时间',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 89 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键id，自增',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '客户称呼',
  `user_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '客户电话',
  `user_email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '客户邮箱',
  `user_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL COMMENT '客户留言',
  `add_time` datetime NULL DEFAULT NULL COMMENT '生成时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否已经被删除',
  `ip` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '留言用户的客户端IP地址',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id，主键，自增',
  `permission_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '权限名称',
  `permission_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '权限编码',
  `permission_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '权限描述',
  `add_time` datetime NULL DEFAULT NULL COMMENT '新增时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for pic_pro_detail
-- ----------------------------
DROP TABLE IF EXISTS `pic_pro_detail`;
CREATE TABLE `pic_pro_detail`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id，主键',
  `product_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '产品的编码',
  `pic_src` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '产品详情中用到的图片',
  `add_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否已经被删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id，主键，递增',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '产品名称',
  `origin_price` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '产品原价',
  `expect_price` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '期望价格',
  `bargain_allowed` tinyint NOT NULL COMMENT '是否可以砍价',
  `product_desc` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '产品描述',
  `product_pic_src` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '产品列表介绍图片',
  `on_sale` tinyint NOT NULL COMMENT '是否在售',
  `add_time` datetime NULL DEFAULT NULL COMMENT '新增时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `sold_time` datetime NULL DEFAULT NULL COMMENT '售出时间',
  `product_num` int NOT NULL COMMENT '产品库存数量',
  `like_num` int NULL DEFAULT NULL COMMENT '喜欢此产品的人数',
  `permissions` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '权限',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否删除',
  `product_addr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '产品目前所在地点',
  `product_owner_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '产品所有者联系电话',
  `product_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '此产品的编码用于查询详情文件',
  `user_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '上传此产品的用户账号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id，主键，自增',
  `role_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '角色名称',
  `role_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '角色编码',
  `role_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '角色描述',
  `add_time` datetime NULL DEFAULT NULL COMMENT '新增时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for roles_permissions
-- ----------------------------
DROP TABLE IF EXISTS `roles_permissions`;
CREATE TABLE `roles_permissions`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id，主键，自增',
  `role_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '角色code',
  `permission_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '权限code',
  `add_time` datetime NULL DEFAULT NULL COMMENT '新增时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `role_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '角色名称',
  `permission_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '权限名称',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否已经被删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id，主键，自增',
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '账户名称',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '账户昵称',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号码',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `add_time` datetime NULL DEFAULT NULL COMMENT '新增时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否删除',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for users_likes
-- ----------------------------
DROP TABLE IF EXISTS `users_likes`;
CREATE TABLE `users_likes`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id，自增',
  `user_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '账户',
  `product_id` int NOT NULL COMMENT '喜欢的产品id',
  `add_date` datetime NULL DEFAULT NULL COMMENT '新增时间',
  `update_date` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名称',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '产品名称',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否已经被删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for users_roles
-- ----------------------------
DROP TABLE IF EXISTS `users_roles`;
CREATE TABLE `users_roles`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id，主键，自增',
  `user_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '用户account',
  `role_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NOT NULL COMMENT '角色code',
  `add_time` datetime NULL DEFAULT NULL COMMENT '新增时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名称',
  `role_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bg_0900_ai_ci NULL DEFAULT NULL COMMENT '角色名称',
  `is_del` tinyint NULL DEFAULT NULL COMMENT '是否已经被删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bg_0900_ai_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
