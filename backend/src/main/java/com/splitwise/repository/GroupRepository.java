package com.splitwise.repository;

import com.splitwise.model.Group;
import com.splitwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findByMembersContaining(User user);
    
    List<Group> findByCreatedBy(User user);
    
    @Query("SELECT g FROM Group g JOIN g.members m WHERE m.id = :userId")
    List<Group> findGroupsByUserId(@Param("userId") Long userId);
    
    Optional<Group> findByNameAndCreatedBy(String name, User createdBy);
    
    boolean existsByNameAndCreatedBy(String name, User createdBy);
}
