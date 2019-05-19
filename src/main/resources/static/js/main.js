var clientsApi = Vue.resource('clients{/id}');

function getUid(list, id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}

Vue.component('clients-form', {
    props: ['clients', 'clientInput'],
    data: function() {
        return {
            name: '',
            balance: '',
            id: ''
        }
    },
    watch: {
        clientInput: function(input) {
            this.name= input.name;
            this.balance = input.balance;
            this.id = input.id;
        }
    },
    template:
        '<div>' +
        '   <input type="text" placeholder="Имя клиента" v-model="name"/>' +
        '   <input type="text" placeholder="Баланс клиента" v-model="balance"/>' +
        '   <input type="button" value="Сохранить" @click="save"/>' +
        '</div>',
    methods: {
        save: function () {
            var input = {
                name: this.name,
                balance: this.balance
            };

            if (this.id) {
                clientsApi.update({id: this.id}, input).then(result =>
                    result.json().then(data => {
                        const index = getUid(this.clients, data.id);
                        this.clients.splice(index, 1, data);
                        this.id = '';
                    })
                )
            } else {
                clientsApi.save({}, input).then(result =>
                    result.json().then(data => {
                        this.clients.push(data);
                    })
                )
            }

            this.name = '';
            this.balance = '';
        }
    }
});

Vue.component('clients-row', {
    props: ['client', 'clients', 'editClient'],
    template:
        '<div >' +
        '   {{ client.name }} {{ client.balance }}' +
        '   <span style="position: absolute; right: 0px;">' +
        '       <input type="button" value="Изменить" @click="edit"/>' +
        '       <input type="button" value="Удалить" @click="del"/>' +
        '   </span>' +
        '</div>',
    methods: {
        edit: function() {
            this.editClient(this.client);
        },
        del: function() {
            clientsApi.remove({id: this.client.uid}).then(result => {
                if (result.ok) {
                    this.clients.splice(this.clients.indexOf(this.client), 1);
                }
            })
        }
    }
});

Vue.component('clients-list', {
    props:  ['clients'],
    data: function() {
        return {
            client: null
        }
    },
    template:
        '<div style="position: relative; width: 700px;">' +
        '   <clients-form ' +
        '       :clients="clients" ' +
        '       :clientInput="client">' +
        '   </clients-form>' +
        '   <clients-row v-for="client in clients" ' +
        '       :key="client.uid" ' +
        '       :client="client" ' +
        '       :editClient="editClient" ' +
        '       :clients="clients">' +
        '   </clients-row>' +
        '</div>',
    created: function() {
        clientsApi.get().then(result =>
            result.json().then( data =>
                data.forEach(client =>
                    this.clients.push(client))
            )
        )
    },
    methods: {
        editClient: function(client) {
            this.client = client;
        }
    }
});

var clientsApp = new Vue({
    el: '#clients',
    template: '<clients-list :clients="clients"/>',
    data: {
        clients: []
    }
});