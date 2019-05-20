const clientsApi = Vue.resource('clients{/uuid}');

function getUuid(list, uuid) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].uuid === uuid) {
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
            uuid: ''
        }
    },
    watch: {
        clientInput: function(input, oldInput) {
            this.name= input.name;
            this.balance = input.balance;
            this.uuid = input.uuid;
        }
    },
    template:
        '<div>' +
        '   <input type="text" placeholder="Имя клиента" v-model="name"/>' +
        '   <input type="text" placeholder="Баланс клиента" v-model="balance"/>' +
        '   <input type="button" value="Сохранить" @click="saveItem"/>' +
        '</div>',
    methods: {
        saveItem: function () {
            const input = {
                name: this.name,
                balance: this.balance
            };

            if (this.uuid) {
                clientsApi.update({uuid: this.uuid}, input).then(result =>
                    result.json().then(data => {
                        const index = getUuid(this.clients, data.uuid);
                        this.clients.splice(index, 1, data);
                        this.uuid = '';
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
        '   {{ client.uuid}} {{ client.name }} {{ client.balance }}' +
        '   <span style="position: absolute; right: 0px;">' +
        '       <input type="button" value="Изменить" @click="editItem"/>' +
        '       <input type="button" value="Удалить" @click="deleteItem"/>' +
        '   </span>' +
        '</div>',
    methods: {
        editItem: function() {
            this.editClient(this.client);
        },
        deleteItem: function() {
            clientsApi.remove({uuid: this.client.uuid}).then(result => {
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
        '       :key="client.uuid" ' +
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

const app = new Vue({
    el: '#clients',
    template: '<clients-list :clients="clients"/>',
    data: {
        clients: []
    }
});
