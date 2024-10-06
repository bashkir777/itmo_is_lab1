package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.Orden;
import com.bashkir777.api.data.entities.User;
import com.bashkir777.api.data.repositories.OrdenRepository;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.OrdenDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class OrdenService {

    private final OrdenRepository ordenRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    public OperationInfo createOrden(String ordenTitle) throws IllegalArgumentException {
        if(ordenTitle.length() < 7){
            throw new IllegalArgumentException("orden title must be at least 7 characters");
        }
        var orden = new Orden();
        orden.setTitle(ordenTitle);
        orden.setCreatedBy(getCurrentUser());
        ordenRepository.save(orden);
        return new OperationInfo(true, "Orden created successfully");
    }

    public Orden getOrdenById(long id) throws IllegalArgumentException {
        return ordenRepository.findOrdenById(id).
                orElseThrow(()-> new IllegalArgumentException("orden with id " + id + " not found"));
    }

    public List<OrdenDTO> getAllOrdens() {
        return ordenRepository.findAll().stream().map(orden -> OrdenDTO.builder().
                id(orden.getId()).title(orden.getTitle()).
                createdBy(orden.getCreatedBy().getUsername()).build()).toList();
    }

    public OperationInfo deleteOrden(long id) throws IllegalArgumentException{
        getOrdenById(id); // throw exception if orden does not exist
        ordenRepository.deleteById(id);
        return new OperationInfo(true, "Orden deleted successfully");
    }

}
