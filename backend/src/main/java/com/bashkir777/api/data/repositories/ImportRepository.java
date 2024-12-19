package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.Coordinates;
import com.bashkir777.api.data.entities.ImportOperation;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ImportRepository {

    private final SessionFactory sessionFactory;

    public void save(ImportOperation importOperation) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                session.saveOrUpdate(importOperation);
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw e;
            }
        }
    }

    public List<ImportOperation> findAll() {
        try (Session session = sessionFactory.openSession()) {
            Query<ImportOperation> query = session.createQuery("FROM ImportOperation", ImportOperation.class);
            return query.getResultList();
        }
    }

}
