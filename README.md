# 简历汪

## 提交规范

| 类型（type） | 含义                                              | 示例                                            |
| ------------ | ------------------------------------------------- | ----------------------------------------------- |
| **feat**     | 新功能（feature）                                 | `feat(user): add login button`                  |
| **fix**      | 修复 bug                                          | `fix(api): correct null pointer handling`       |
| **docs**     | 仅文档变更（documentation）                       | `docs(readme): update installation steps`       |
| **style**    | 不影响逻辑的样式变动（空格、格式、分号等）        | `style: format code with prettier`              |
| **refactor** | 重构（既不是新增功能，也不是修 bug）              | `refactor(component): simplify render logic`    |
| **perf**     | 性能优化（performance）                           | `perf(list): improve rendering performance`     |
| **test**     | 测试相关修改（添加、修改、重构测试用例）          | `test(utils): add unit tests for parseDate`     |
| **build**    | 构建系统或依赖相关变动（npm、webpack、rollup 等） | `build(deps): upgrade vite to 5.x`              |
| **ci**       | CI 配置文件或脚本变更                             | `ci(github): add lint workflow`                 |
| **chore**    | 不影响源代码的其他改动（构建脚本、工具、配置等）  | `chore: update .gitignore`                      |
| **revert**   | 回滚先前的提交                                    | `revert: revert "feat(user): add login button"` |

**补充说明：**

- **scope** 是可选的，用于标明影响的范围（如模块名、功能名）。
- 标题建议不超过 **50 个字符**，首字母小写，不加句号。
- 一次 commit 只对应一种 `type`，以保证提交历史清晰可读。
