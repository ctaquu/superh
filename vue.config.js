module.exports = {
    devServer: {
        port: 8081, // CHANGE YOUR PORT HERE!
        https: true,
        proxy: {
            '/api': {
                target: 'https://superheroapi.com',
                secure: false
            }
        }
    },
}