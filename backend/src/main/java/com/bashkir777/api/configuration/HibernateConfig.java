package com.bashkir777.api.configuration;

import com.bashkir777.api.data.entities.*;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.service.ServiceRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class HibernateConfig {


    @Bean
    public SessionFactory buildSessionFactory() {
        try {
            org.hibernate.cfg.Configuration configuration = new org.hibernate.cfg.Configuration();

            configuration.addAnnotatedClass(User.class);
            configuration.addAnnotatedClass(Updated.class);
            configuration.addAnnotatedClass(SpaceMarine.class);
            configuration.addAnnotatedClass(RefreshToken.class);
            configuration.addAnnotatedClass(Orden.class);
            configuration.addAnnotatedClass(Coordinates.class);
            configuration.addAnnotatedClass(AdminApplication.class);
            configuration.addAnnotatedClass(Chapter.class);
            configuration.addAnnotatedClass(ImportOperation.class);

            configuration.setProperty("hibernate.connection.driver_class", "org.postgresql.Driver");
            configuration.setProperty("hibernate.connection.url",
                    System.getenv("database_url") == null
                    ? "jdbc:postgresql://localhost:5432/lab3"
                    : System.getenv("database_url"));
            configuration.setProperty("hibernate.connection.username",
                    System.getenv("database_username") == null
                            ? "root": System.getenv("database_username") );
            configuration.setProperty("hibernate.connection.password",
                    System.getenv("database_password") == null
                            ? "root" : System.getenv("database_password"));
            configuration.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
            configuration.setProperty("hibernate.show_sql", "true");
            configuration.setProperty("hibernate.hbm2ddl.auto", "create-drop");

            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                    .applySettings(configuration.getProperties())
                    .build();

            return configuration.buildSessionFactory(serviceRegistry);
        } catch (Throwable ex) {
            System.err.println("Initial SessionFactory creation failed." + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

}