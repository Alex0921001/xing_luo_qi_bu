import log4js from 'log4js' // 配置 log4js 日志库
log4js.configure({
  appenders: {
    // 定义日志输出的目的地，即日志的存储方式
    out: {
      // 定义一个名为 'out' 的 appender
      type: 'stdout', // 指定输出类型为标准输出（控制台）
      layout: {
        // 定义日志输出的布局格式
        type: 'colored' // 使用带颜色的布局，使控制台输出带有颜色区分，便于阅读
      }
    },
    file: {
      // 定义一个名为 'file' 的 appender
      type: 'file', // 指定输出类型为文件
      filename: './logs/server.log' // 设置日志文件的存储路径和文件名
    }
  },
  categories: {
    // 定义日志的分类
    default: {
      // 配置默认类别的日志属性
      appenders: ['out', 'file'], // 此类别的日志将使用名为 'out' 和 'file' 的 appender 输出
      level: 'debug' // 设置此类别的日志记录级别为 debug（记录所有debug及以上级别的日志）
    }
  }
}) // 获取 logger
//在 log4js 中，getLogger 方法用于创建或获取一个日志记录器（logger）对象。这个对象提供了接口来记录日志消息，可以指定不同的日志级别，如 debug, info, warn, error, 等
const logger = log4js.getLogger('default') // req：接收前端发送过来的信息
// res：返回给前端的内容
// next：决定是否执行下一个中间件，如果不写就一直卡在这里
const loggerMiddleware = (req, res, next) => {
  logger.debug(`${req.method} ${req.url}`) // 记录请求方法和URL
  next()
}
export default loggerMiddleware
