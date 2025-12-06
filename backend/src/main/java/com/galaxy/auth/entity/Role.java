package com.galaxy.auth.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Role Entity
 * Supports RBAC (Role-Based Access Control)
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String name; // ADMIN, MODERATOR, USER, GUEST

    @Column(length = 100)
    private String description;

    // Role hierarchy levels (higher = more permissions)
    @Column(nullable = false)
    @Builder.Default
    private int level = 0; // GUEST=0, USER=1, MODERATOR=2, ADMIN=3

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return name != null && name.equals(role.name);
    }

    @Override
    public int hashCode() {
        return name != null ? name.hashCode() : 0;
    }
}


