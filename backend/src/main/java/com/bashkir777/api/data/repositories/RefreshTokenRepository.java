package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.RefreshToken;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRepository {

    private final SessionFactory sessionFactory;

    public Optional<RefreshToken> findByUser_Id(Long userId) {
        try (Session session = sessionFactory.openSession()) {
            Query<RefreshToken> query = session.createQuery("FROM RefreshToken WHERE user.id = :userId", RefreshToken.class);
            query.setParameter("userId", userId);
            return query.uniqueResultOptional();
        }
    }

    public void save(RefreshToken refreshToken) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                session.saveOrUpdate(refreshToken);
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e.getMessage());
            }
        }
    }

    public void delete(RefreshToken refreshToken) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            try {
                session.delete(refreshToken);
                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e.getMessage());
            }
        }
    }
}