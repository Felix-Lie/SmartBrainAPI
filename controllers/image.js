const { InferenceClient } = require('@huggingface/inference');
const client = new InferenceClient(process.env.HF_TOKEN);

const handleAPI = (imageUrl) => {
    return fetch(imageUrl)
        .then(imageResponse => imageResponse.blob())
        .then(imageBlob => {
            return client.objectDetection({
                model: 'facebook/detr-resnet-50',
                data: imageBlob
            });
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const handleImage = (req,res, db) => {
    console.log('Image Body: ', req.body);
    const { id , imageUrl} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(async entries => {
        const response = await handleAPI(imageUrl);
        res.json({
            entries: entries[0].entries,
            detections: response,
        });
    })
    .catch(err => {
        console.log(err);
        res.status(400).json('Unable to process image');
    });
}

module.exports = {
    handleImage: handleImage,
    handleAPI: handleAPI
}