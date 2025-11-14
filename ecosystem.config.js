// 启动指令：pm2 start /sunday/resume/jian-li-wang/ecosystem.config.js
const path = require('path')
module.exports = {
	apps: [
		{
			name: 'Mian-Shi-Wang-Nuxt',
			port: '3001',
			exec_mode: 'fork',
			script: path.join(__dirname, './.output/server', 'index.mjs')
		}
	]
}
