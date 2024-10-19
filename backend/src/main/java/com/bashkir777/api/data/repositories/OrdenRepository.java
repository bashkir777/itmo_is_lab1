package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.Orden;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class OrdenRepository {

    private final SessionFactory sessionFactory;

    public Optional<Orden> findOrdenById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            return Optional.ofNullable(session.get(Orden.class, id));
        }
    }

    public void save(Orden orden) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                session.saveOrUpdate(orden);
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw e;
            }
        }
    }

    public void deleteById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                Orden orden = session.get(Orden.class, id);
                if (orden != null) {
                    session.delete(orden);
                }
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    public List<Orden> findAll() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("FROM Orden", Orden.class).getResultList();
        }
    }
}