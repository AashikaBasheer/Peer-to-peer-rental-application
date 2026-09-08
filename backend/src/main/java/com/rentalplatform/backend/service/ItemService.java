package com.rentalplatform.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rentalplatform.backend.entity.Item;
import com.rentalplatform.backend.repository.ItemRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository repo;
    
    public List<Item> getAll(){
        return repo.findAll();
    }

    public List<Item> getAvailable(){
        return repo.findByAvailabilityTrue();
    }

    public List<Item> getByOwner(UUID ownerId) {
        return repo.findByOwnerId(ownerId);
    }

    public Item get(Long id){
        return repo.findById(id).orElseThrow(()->new RuntimeException("Item not found"));
    }

    public Item create(Item item){
        item.setAvailability(true);
        return repo.save(item);
    }

    public void delete(Long id){
        repo.deleteById(id);
    }

}
