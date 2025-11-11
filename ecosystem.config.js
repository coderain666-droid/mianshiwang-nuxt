// 启动指令：pm2 start ecosystem.config.js
const path = require('path')
module.exports = {
	apps: [
		{
			name: 'Jian-Li-Wang-Nuxt',
			port: '3000',
			exec_mode: 'fork',
			script: path.join(__dirname, './.output/server', 'index.mjs')
		}
	]
}
