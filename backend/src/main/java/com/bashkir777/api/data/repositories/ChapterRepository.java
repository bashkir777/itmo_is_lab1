package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.Chapter;
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
public class ChapterRepository {

    private final SessionFactory sessionFactory;

    public List<Chapter> findAll(int page, int size) {
        try (Session session = sessionFactory.openSession()) {
            Query<Chapter> query = session.createQuery("FROM Chapter", Chapter.class);
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            return query.getResultList();
        }
    }

    public long countAll() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("SELECT COUNT(*) FROM Chapter", Long.class).uniqueResult();
        }
    }

    public Optional<Chapter> findById(Long id) {
        try (Session session = sessionFactory.openSession()) {
            Chapter chapter = session.get(Chapter.class, id);
            return Optional.ofNullable(chapter);
        }
    }

    public void save(Chapter chapter) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                session.saveOrUpdate(chapter);
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw e;
            }
        }
    }
}