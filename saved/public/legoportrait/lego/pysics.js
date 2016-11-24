function PhysicsObject() {
    this.aabb = [];// Axis Aligned Bounding Box
    this.acceleration = [0,0,0];
}
PhysicsObject.prototype.addForce()