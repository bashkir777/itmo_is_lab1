package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.SpaceMarine;
import com.bashkir777.api.data.enums.Weapon;
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
public class SpaceMarineRepository {

    private final SessionFactory sessionFactory;

    public List<SpaceMarine> findAll(int page, int size) {
        try (Session session = sessionFactory.openSession()) {
            Query<SpaceMarine> query = session.createQuery("FROM SpaceMarine", SpaceMarine.class);
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            System.out.println(query.getResultList().size());
            return query.getResultList();
        }
    }

    public Optional<SpaceMarine> findById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            return Optional.ofNullable(session.get(SpaceMarine.class, id));
        }
    }

    public long countAll() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("SELECT COUNT(*) FROM SpaceMarine", Long.class).uniqueResult();
        }
    }

    public long countByOrdenId(Long ordenId) {
        try (Session session = sessionFactory.openSession()) {
            Query<Long> query = session.createQuery("SELECT COUNT(*) FROM SpaceMarine WHERE orden.id = :ordenId", Long.class);
            query.setParameter("ordenId", ordenId);
            return query.uniqueResult();
        }
    }

    public long countByOrdenIsNull() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("SELECT COUNT(*) FROM SpaceMarine WHERE orden IS NULL", Long.class).uniqueResult();
        }
    }

    public List<SpaceMarine> findByOrdenId(Long ordenId, int page, int size) {
        try (Session session = sessionFactory.openSession()) {
            Query<SpaceMarine> query = session.createQuery("FROM SpaceMarine WHERE orden.id = :ordenId", SpaceMarine.class);
            query.setParameter("ordenId", ordenId);
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            return query.getResultList();
        }
    }

    public List<SpaceMarine> findByOrdenIsNull(int page, int size) {
        try (Session session = sessionFactory.openSession()) {
            Query<SpaceMarine> query = session.createQuery("FROM SpaceMarine WHERE orden IS NULL", SpaceMarine.class);
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            return query.getResultList();
        }
    }

    public Optional<SpaceMarine> findFirstByOrderByCreationDateDesc() {
        try (Session session = sessionFactory.openSession()) {
            Query<SpaceMarine> query = session.createQuery("FROM SpaceMarine ORDER BY creationDate DESC", SpaceMarine.class);
            query.setMaxResults(1);
            return query.uniqueResultOptional();
        }
    }

    public List<SpaceMarine> findByNameStartingWithIgnoreCase(String prefix) {
        try (Session session = sessionFactory.openSession()) {
            Query<SpaceMarine> query = session.createQuery("FROM SpaceMarine WHERE LOWER(name) LIKE LOWER(CONCAT(:prefix, '%'))", SpaceMarine.class);
            query.setParameter("prefix", prefix);
            return query.getResultList();
        }
    }

    public List<SpaceMarine> findByWeaponTypeLessThan(Weapon weaponType) {
        try (Session session = sessionFactory.openSession()) {
            Query<SpaceMarine> query = session.createQuery("FROM SpaceMarine WHERE weaponType < :weaponType", SpaceMarine.class);
            query.setParameter("weaponType", weaponType);
            return query.getResultList();
        }
    }

    public void save(SpaceMarine spaceMarine) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                session.saveOrUpdate(spaceMarine);
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    public void delete(SpaceMarine spaceMarine) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                session.delete(spaceMarine);
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e.getMessage());
            }
        }
    }
}