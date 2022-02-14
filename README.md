预览地址：https://imkeys.github.io/svg-map-vue/


# 压缩JS

```
# 全局安装
npm install uglify-js -g

# 使用

uglifyjs app.js -m -o app.min.js

# 如果出现报错，使用管理员权限打开cmd

```


```
* source-map [string]，生成source map文件。
* –source-map-root [string], 指定生成source map的源文件位置。
* –source-map-url [string], 指定source map的网站访问地址。
* –source-map-include-sources，设置源文件被包含到source map中。
* –in-source-map，自定义source map，用于其他工具生成的source map。
* –screw-ie8, 用于生成完全兼容IE6-8的代码。
* –expr, 解析一个表达式或JSON。
* -p, –prefix [string], 跳过原始文件名的前缀部分，用于指定源文件、source map和输出文件的相对路径。
* -o, –output [string], 输出到文件。
* -b, –beautify [string], 输出带格式化的文件。
* -m, –mangle [string], 输出变量名替换后的文件。
* -r, –reserved [string], 保留变量名，排除mangle过程。
* -c, –compress [string], 输出压缩后的文件。
* -d, –define [string], 全局定义。
* -e, –enclose [string], 把所有代码合并到一个函数中，并提供一个可配置的参数列表。
* –comments [string], 增加注释参数，如@license、@preserve。
* –preamble [string], 增加注释描述。
* –stats, 显示运行状态。
* –acorn, 用Acorn做解析。
* –spidermonkey, 解析SpiderMonkey格式的文件，如JSON。
* –self, 把UglifyJS2做为依赖库一起打包。
* –wrap, 把所有代码合并到一个函数中。
* –export-all, 和–wrap一起使用，自动输出到全局环境。
* –lint, 显示环境的异常信息。
* -v, –verbose, 打印运行日志详细。
* -V, –version, 打印版本号。
* –noerr, 忽略错误命令行参数。
```


对文件夹下面的所有JS文件压缩，windows使用bat批处理，linux可以使用shell，或者直接利用Node下面的fs模块。
Windows下面的bat处理脚本。（注意：备份原JS文件，压缩的JS文件会直接替换原JS文件）

```
@echo off
:: 设置压缩JS文件的根目录，会自动压缩所有的JS文件
SET JSFOLDER=D:\javascript
chdir /d %JSFOLDER%
for /r . %%a in (*.js) do (
@echo 正在压缩 %%~a ...
uglifyjs %%~fa -m -o %%~fa
)
echo 完成!
pause & exit
```

