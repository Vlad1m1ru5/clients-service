package org.clients.list.controller;

import org.clients.list.entity.Client;
import org.clients.list.repository.ClientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("clients")
public class ClientsController {
    private final ClientRepository clientRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(ClientsController.class);

    @Autowired
    public ClientsController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @GetMapping
    public List<Client> getClients() {
        return clientRepository.findAll();
    }

    @GetMapping("{uuid}")
    public Client getClient(@PathVariable("uuid") Client clientFromRepo) {
        return clientFromRepo;
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    @PutMapping("{uuid}")
    public Client editClient(@PathVariable("uuid") Client clientFromRepo, @RequestBody Client client) {
        BeanUtils.copyProperties(client, clientFromRepo, "uuid");
        return clientRepository.save(clientFromRepo);
    }

    @DeleteMapping("{uuid}")
    public void deleteClient(@PathVariable("uuid") Client clientFromRepo) {
        clientRepository.delete(clientFromRepo);
    }
}
