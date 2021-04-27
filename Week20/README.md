学习笔记
持续集成
daily build

BVT- build verification test

lint - 代码风格检查

一般会放到pre-commit中
chmod -x pre-commit - 赋予命令的执行权限，x表示执行
git hooks的基本用法 - 钩子函数

以sample结尾的并不会去执行
git stash 机制

git stash push -k
Git stash pop
phatomJS过时

chrome 的headless模式

Puppeteer

alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"

chrome --headless
chrome --headless --dump-dom about:blank
学习总结
发布系统的这两周学习内容主要是工具使用学习，有scp、NodeJS流等等；学习了在发布过程中使用git oauth进行权限验证，通过重重权限校验，实现了client、pulish-server、server三个系统间组合式的发布流程。持续集成这部分内容学习到了使用pre-commit、eslint、child_process等进行了代码提交前的格式校验，实现了git工作区、暂存区之间的代码分离检查，不合规范的代码不能提交等等