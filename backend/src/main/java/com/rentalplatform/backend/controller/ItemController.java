package com.rentalplatform.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentalplatform.backend.entity.Item;
import com.rentalplatform.backend.service.ItemService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService service;
    @GetMapping
    public List<Item> getAll(){
        return service.getAll();
    }

    @GetMapping("/available")
    public List<Item> getAvailable() {
        return service.getAvailable();
    }

    @GetMapping("/owner/{ownerId}")
    public List<Item> getByOwner(@PathVariable UUID ownerId) {
        return service.getByOwner(ownerId);
    }

    @GetMapping("/{id}")
    public Item get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public Item create(@RequestBody Item item){
        return service.create(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
    
    
}
