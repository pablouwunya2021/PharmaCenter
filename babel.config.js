module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    sourceType: 'unambiguous',
    env: {
        test: {
            presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                ['@babel/preset-react', { runtime: 'automatic', development: true }]
            ],
            sourceMaps: 'inline'
        }
    }
};
