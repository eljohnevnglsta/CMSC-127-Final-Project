import needle from 'needle';

needle.post('http://localhost:3001/view-establishment-review',
    {
    name: 'Deli Delight'
    },
    (err, res) => {
    console.log(res.body);  
});