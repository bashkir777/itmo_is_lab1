package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.AdminApplication;
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
public class AdminApplicationRepository {

    private final SessionFactory sessionFactory;

    public Optional<AdminApplication> findById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            AdminApplication adminApplication = session.get(AdminApplication.class, id);
            return Optional.ofNullable(adminApplication);
        }
    }

    public void save(AdminApplication adminApplication) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                session.saveOrUpdate(adminApplication);
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e.getMessage());
            }
        }
    }
    public List<AdminApplication> findAll() {
        try (Session session = sessionFactory.openSession()) {
            Query<AdminApplication> query = session.createQuery("FROM AdminApplication", AdminApplication.class);
            return query.getResultList();
        }
    }
}