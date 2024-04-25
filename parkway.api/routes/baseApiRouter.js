const configureBaseApiRoutes = (router, addHandler, getAllHandler, getByIdHandler, updateHandler, deleteHandler, basePath = '') => {
    router.post(`${basePath}/`, addHandler);
    router.get(`${basePath}/`, getAllHandler);
    router.get(`${basePath}/:id`, getByIdHandler);
    router.patch(`${basePath}/:id`, updateHandler);
    router.delete(`${basePath}/:id`, deleteHandler);
};

const addNotFoundHandler = (router) => {
    router.use('*', (req, res) => {
        res.status(404).json({ message: 'Route Not Found' });
    });
};

module.exports = {
    addNotFoundHandler,
    configureBaseApiRoutes
};
