const BookRequest = require('../models/BookRequest');

exports.createRequest = async (req, res) => {
    const { title, author, additionalInfo } = req.body;

    try {
        const newRequest = new BookRequest({
            user: req.user.id,
            bookDetails: {
                title,
                author,
                additionalInfo
            }
        });

        await newRequest.save();
        res.json(newRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const requests = await BookRequest.find().populate('user', ['name', 'studentId']).sort({ requestDate: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateRequestStatus = async (req, res) => {
    const { status } = req.body; // approved, rejected
    try {
        let request = await BookRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        request.status = status;
        await request.save();
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
