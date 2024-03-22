const configureBaseApiRoutes = (router, addHandler, getAllHandler, getByIdHandler, updateHandler, deleteHandler) => {
    router.post('/', addHandler);
    router.get('/', getAllHandler);
    router.get('/:id', getByIdHandler);
    router.patch('/:id', updateHandler);
    router.delete('/:id', deleteHandler);
};

const addNotFoundHandler = (router) => {
    router.use('*', (req, res) => {
        res.status(404).json({ message: 'Not Found' });
    });
};

module.exports = {
    addNotFoundHandler,
    configureBaseApiRoutes
};
