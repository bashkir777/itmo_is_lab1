package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.Coordinates;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CoordinatesRepository {

    private final SessionFactory sessionFactory;

    public List<Coordinates> findAll(int page, int size) {
        try (Session session = sessionFactory.openSession()) {
            Query<Coordinates> query = session.createQuery("FROM Coordinates", Coordinates.class);
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            return query.getResultList();
        }
    }

    public long countAll() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("SELECT COUNT(*) FROM Coordinates", Long.class).uniqueResult();
        }
    }

    public void save(Coordinates coordinates) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                session.saveOrUpdate(coordinates);
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw e;
            }
        }
    }

    public Optional<Coordinates> findById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            Coordinates coordinates = session.get(Coordinates.class, id);
            return Optional.ofNullable(coordinates);
        }
    }
}