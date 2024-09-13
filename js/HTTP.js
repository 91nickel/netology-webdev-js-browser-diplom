class HTTP {
    constructor(controller) {
        this.controller = controller;
    }
    send(data, link, headers) {
        console.log('HTTP -> send');
        console.log(data);
        for (const [k, v] of data) {
            console.log(k + ': ' + v);
        }

        return fetch(link, {
            body: data,
            credentials: 'same-origin',
            method: 'POST',
            headers: headers
        }).then((res) => {
            return res.json();
        })
    }
}