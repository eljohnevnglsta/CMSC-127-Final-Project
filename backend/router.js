

const router = (app) => {
    app.get('/', (req, res) => {
        res.send('Server is running');
    })
}   

export default router;