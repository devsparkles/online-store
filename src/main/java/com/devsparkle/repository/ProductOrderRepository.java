package com.devsparkle.repository;

import com.devsparkle.domain.Invoice;
import com.devsparkle.domain.ProductOrder;

import liquibase.pro.packaged.T;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data  repository for the ProductOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductOrderRepository extends JpaRepository<ProductOrder, Long> {

    Page<ProductOrder> findAllByCustomerUserLogin(String login, Pageable pageble);

    Optional<ProductOrder> findOneByIdAndCustomerUserLogin(Long id, String login);

}
