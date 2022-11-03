# API-Codegen

API-Codegen 是一个根据 Swagger 或 Open API 的 JSON 或 yaml 文件生成前端接口层代码以及对应 TypeScript 定义的工具。

## 使用

1. 安装

   `npm install api-codegen-ts`

2. 生成配置文件

   `cgen init`

3. 修改配置文件

   根据自己的需求修改配置文件 `api-codegen.config.json`。

4. 执行命令

  cd [project]，执行如下命令：

   ```bash
   cgen
   ```

## Config 参数说明

- **`requestCreateMethod`: String [可选项]**

  表示方法或函数名，用于创建发起请求的函数。默认值为 createRequest。

  createRequest 实现参考：

  ``` ts
  import axios, { AxiosRequestConfig } from "axios";

  const axiosInstance = axios.create({
    baseURL: "https://petstore.swagger.io",
  });

  export const createRequest = <TReq, TResp = any>(
    _: string,
    requestConfigCreator: (args: TReq) => AxiosRequestConfig,
  ) => {
    return (args: TReq) => {
      return axiosInstance.request<TResp>(requestConfigCreator(args));
    };
  };
  ```

- **`requestCreateLib`: String [可选项]**

  表示 `requestCreateMethod` 所在的文件路径。用于导入 `requestCreateMethod` 方法。

  > 注意：若 requestCreateMethod、requestCreateLib 都缺省，生成的结构有所不同。

- **`apiSpecsPaths`: Array [必填项]**

  - path(required): 用于配置 swagger/openapi 文件所在的地址，支持的文件格式有 `.json`, `.yaml`, `.yml`。
  - name(required): 生成文件的名称

  > 注意：提供的 Swagger/Openapi json 中，必须保证每个 API 请求都包含属性 `operationId`，用于构造函数签名。

- **`outputFolder`: String [可选项]**

  表示输出生成代码的目录名称。默认值为 api-clients。

- **`options`: Object [可选项]**
   - **`eslintDisable`: Boolean [可选项]，默认值: true**
    生成的文件是否需要 eslint 检测。

  - **`caseType`: Boolean [可选项]，默认值: default**

    可选值有：'default' | 'camel' | 'snake'
    - default: 保留接口定义字段风格
    - camel: 使用小驼峰风格
    - snake: 使用 snake 风格

  - **`typeWithPrefix`: Boolean [可选项]，默认值: false**

    如果设置为 true，会为所有的生成的 interface 和 type 加上前缀，其中 interface 加上 `I` 前缀，type 加上 `T` 前缀。

  - **`withComments`: Boolean [可选项]，默认值: false**

    用于设置在生成代码中是否显示注解。比如你在 swagger 文档中通过 `summary`, `description` 等字段，为一个 API 添加了描述，你就可以通过这个开关来控制这个描述是否显示在最终的生成代码中。

## 试验性功能

试验性功能尚未稳定，如非必要不建议使用。

### Swagger 导入及拆分

支持将 Swagger 文件导入并按路径资源进行拆分。

> 注意：暂时只支持 json 文件，不支持 yaml 文件。

``` shell
cgen import -i [command options]
```

example:

``` shell
cgen import -i https://petstore.swagger.io/v2/swagger.json -o api-data -f
```

Command Options:

| option   | alias | required | default value | description            | example                                        |
| -------- | ----- | -------- | ------------- | ---------------------- | ---------------------------------------------- |
| --input  | -i    | true     | -             | 导入文件的路径         | -i https://petstore.swagger.io/v2/swagger.json |
| --output | -o    | false    | api-data      | 导入后存储的目录       | -o api-data                                    |
| --prefix | -p    | false    | -             | 路径的 base path       | -p /api/v1                                     |
| --force  | -f    | false    | false         | 是否强制清空输出的目录 | -f                                             |

> 建议：调用时带上参数：-f

## 反馈

反馈通过提 issue 的方式：

- [Bug Report](./.gitlab/issue_templates/bug_report.md)
- [Feature Request](./.gitlab/issue_templates/feature_request.md)
