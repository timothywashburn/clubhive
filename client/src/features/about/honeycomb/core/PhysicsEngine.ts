import { Point, Velocity, PhysicsConfig } from '../config/types';

export class PhysicsEngine {
    private config: PhysicsConfig;
    private velocities: Velocity[];
    private basePoints: [number, number][];
    private currentPoints: [number, number][];

    constructor(config: PhysicsConfig) {
        this.config = config;
        this.velocities = [];
        this.basePoints = [];
        this.currentPoints = [];
    }

    initialize(points: [number, number][]): void {
        this.basePoints = points.map(p => [...p] as [number, number]);
        this.currentPoints = points.map(p => [...p] as [number, number]);
        this.velocities = points.map(() => ({ vx: 0, vy: 0 }));
    }

    updatePhysics(mousePosition: Point): void {
        for (let i = 0; i < this.currentPoints.length; i++) {
            const current = this.currentPoints[i];
            const base = this.basePoints[i];
            const velocity = this.velocities[i];

            // Spring force towards base position (ALWAYS ACTIVE)
            const springX = (base[0] - current[0]) * this.config.springStrength;
            const springY = (base[1] - current[1]) * this.config.springStrength;

            // Mouse attraction force (suck in)
            const mouseForce = this.calculateMouseForce(current, mousePosition);

            // Update velocity with forces
            velocity.vx = (velocity.vx + springX + mouseForce.x) * this.config.damping;
            velocity.vy = (velocity.vy + springY + mouseForce.y) * this.config.damping;

            // Update position
            current[0] += velocity.vx;
            current[1] += velocity.vy;
        }
    }

    private calculateMouseForce(currentPos: [number, number], mousePos: Point): { x: number; y: number } {
        let mouseForceX = 0;
        let mouseForceY = 0;

        // Only apply mouse force if mouse is within reasonable bounds
        if (mousePos.x > -500) {
            const dx = mousePos.x - currentPos[0];
            const dy = mousePos.y - currentPos[1];
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.config.mouseRadius && distance > 0) {
                let force = ((this.config.mouseRadius - distance) / this.config.mouseRadius) * this.config.mouseForce;

                // Apply distance-based force scaling
                const clampedDistance = Math.min(
                    Math.max(distance, this.config.minDistance),
                    this.config.cutoffDistance
                );
                force *= clampedDistance / this.config.cutoffDistance;

                const angle = Math.atan2(dy, dx);
                mouseForceX = Math.cos(angle) * force;
                mouseForceY = Math.sin(angle) * force;
            }
        }

        return { x: mouseForceX, y: mouseForceY };
    }

    getCurrentPoints(): [number, number][] {
        return this.currentPoints;
    }

    getBasePoints(): [number, number][] {
        return this.basePoints;
    }

    getVelocities(): Velocity[] {
        return this.velocities;
    }

    reset(): void {
        // Reset current points to base positions
        for (let i = 0; i < this.currentPoints.length; i++) {
            this.currentPoints[i][0] = this.basePoints[i][0];
            this.currentPoints[i][1] = this.basePoints[i][1];
            this.velocities[i].vx = 0;
            this.velocities[i].vy = 0;
        }
    }
}