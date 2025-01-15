## 备忘录

1.退款和取消订单都会退还库存，但是超时不支付的订单不会退还库存

## Node版本

v20.14.0

## 依赖导入

```bash
$ yarn install
```

## 项目启动

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 项目测试

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## 项目约定

1. interface名需要以字母 I 开头

<table>
  <tr>
    <td colspan="4">应用层/领域层</td>   
  </tr>
  <tr>
    <td>应用层</td>
    <td>领域层</td>
    <td>基础层</td>
  </tr>
   <tr>
    <td>application</td>
    <td>domain</td>
    <td>infrastructure</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="5">应用层/领域层</td>   
  </tr>
  <tr>
    <td>新增</td>
    <td>删除</td>
    <td>编辑</td>
    <td>查询全部</td>
    <td>查询详情</td>
  </tr>
   <tr>
    <td>add</td>
    <td>delete</td>
    <td>update</td>
    <td>query</td>
    <td>detail</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="4">基础层</td>   
  </tr>
  <tr>
    <td>新增/编辑</td>
    <td>删除</td>
    <td>查询全部</td>
    <td>查询详情</td>
    <td>查询第三方</td>
  </tr>
   <tr>
    <td>save</td>
    <td>remove</td>
    <td>findAll</td>
    <td>findOne</td>
    <td>get</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="5">领域名词</td>   
  </tr>
  <tr>
    <td>用户</td>
    <td>优惠券</td>
    <td>订单</td>
    <td>总订单</td>
    <td>商品</td>
  </tr>
   <tr>
    <td>user</td>
    <td>coupon</td>
    <td>order</td>
    <td>orderTotal</td>
    <td>commodity</td>
  </tr>
</table>
