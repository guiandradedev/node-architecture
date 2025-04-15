import { app } from './app'

const porta = process.env.PORT || 3000

const server = app.listen({ port: porta }, () => console.log(`App on-line na porta ${porta}`))

process.on('SIGINT', () => {//fechar de vez a porta
    // server.close()
    console.log("App finalizado")
})