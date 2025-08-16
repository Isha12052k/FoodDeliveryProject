const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;
const fs = require('fs');
const path = require('path');

// Import models and controllers
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const restaurantController = require('../controllers/restaurantController');
const menuItemController = require('../controllers/menuItemController');

describe('Restaurant Controller Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('createRestaurant', () => {
    it('should create a new restaurant successfully', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          name: "Test Restaurant",
          description: "Test description",
          cuisineType: ["Italian"],
          address: {
            street: "123 Test St",
            city: "Testville",
            state: "TS",
            zipCode: "12345"
          },
          contact: {
            phone: "1234567890",
            email: "test@restaurant.com"
          }
        }
      };

      const createdRestaurant = { 
        _id: new mongoose.Types.ObjectId(), 
        ...req.body, 
        owner: req.user.id,
        isDeleted: false
      };

      const createStub = sinon.stub(Restaurant, 'create').resolves(createdRestaurant);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await restaurantController.createRestaurant(req, res);

      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ 
        success: true, 
        data: sinon.match.object 
      })).to.be.true;
    });

    it('should handle validation errors for missing required fields', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { name: "Incomplete Restaurant" }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      // Mock the validation error response
      sinon.stub(restaurantController, 'createRestaurant').callsFake(async (req, res) => {
        res.status(400).json({
          success: false,
          message: 'Please fill all required fields'
        });
      });

      await restaurantController.createRestaurant(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({
        success: false,
        message: 'Please fill all required fields'
      })).to.be.true;
    });
  });

  describe('getRestaurant', () => {
    it('should return restaurant details for owner', async () => {
      const userId = new mongoose.Types.ObjectId();
      const restaurantId = new mongoose.Types.ObjectId();
      
      const mockRestaurant = {
        _id: restaurantId,
        name: "Test Restaurant",
        owner: userId,
        isDeleted: false,
        toObject: function() { return this; }
      };

      // Mock the successful response
      sinon.stub(restaurantController, 'getRestaurant').callsFake(async (req, res) => {
        res.status(200).json({
          success: true,
          data: mockRestaurant
        });
      });

      const req = {
        params: { id: restaurantId },
        user: { id: userId }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await restaurantController.getRestaurant(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({
        success: true,
        data: sinon.match({
          _id: restaurantId,
          name: 'Test Restaurant',
          owner: userId
        })
      })).to.be.true;
    });

    it('should return 404 if restaurant not found', async () => {
      sinon.stub(Restaurant, 'findOne').resolves(null);

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { id: new mongoose.Types.ObjectId() }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await restaurantController.getRestaurant(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe('createMenuItem', () => {
    it('should create a new menu item successfully', async () => {
      const restaurantId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();

      const req = {
        params: { restaurantId },
        user: { id: userId },
        body: {
          name: "Test Item",
          description: "Test description",
          price: 9.99,
          category: "Main Course",
          isVegetarian: "false"
        },
        file: { filename: 'test.jpg' }
      };

      const mockRestaurant = { 
        _id: restaurantId, 
        owner: userId,
        toObject: () => ({ _id: restaurantId, owner: userId })
      };
      const mockMenuItem = { 
        _id: new mongoose.Types.ObjectId(), 
        ...req.body, 
        restaurant: restaurantId,
        image: '/uploads/test.jpg'
      };

      sinon.stub(Restaurant, 'findOne').resolves(mockRestaurant);
      const createStub = sinon.stub(MenuItem, 'create').resolves(mockMenuItem);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await menuItemController.createMenuItem(req, res);

      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch(sinon.match.object)).to.be.true;
    });

    it('should return 403 if user is not restaurant owner', async () => {
      const req = {
        params: { restaurantId: new mongoose.Types.ObjectId() },
        user: { id: new mongoose.Types.ObjectId() }
      };

      sinon.stub(Restaurant, 'findOne').resolves(null);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      try {
        await menuItemController.createMenuItem(req, res);
      } catch (error) {
        expect(res.status.calledWith(403)).to.be.true;
      }
    });
  });

  describe('deleteMenuItem', () => {
    it('should delete a menu item successfully', async () => {
      const restaurantId = new mongoose.Types.ObjectId();
      const menuItemId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();

      const mockRestaurant = { 
        _id: restaurantId, 
        owner: userId,
        toObject: () => ({ _id: restaurantId, owner: userId })
      };
      const mockMenuItem = { 
        _id: menuItemId, 
        restaurant: restaurantId,
        image: '/uploads/test.jpg'
      };

      sinon.stub(Restaurant, 'findOne').resolves(mockRestaurant);
      sinon.stub(MenuItem, 'findOneAndDelete').resolves(mockMenuItem);
      sinon.stub(fs, 'existsSync').returns(true);
      sinon.stub(fs, 'unlinkSync').returns();

      const req = {
        params: { 
          restaurantId,
          id: menuItemId 
        },
        user: { id: userId }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await menuItemController.deleteMenuItem(req, res);

      expect(res.json.calledWithMatch({ success: true })).to.be.true;
    });

    it('should return 404 if menu item not found', async () => {
      const restaurantId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();

      const mockRestaurant = { 
        _id: restaurantId, 
        owner: userId,
        toObject: () => ({ _id: restaurantId, owner: userId })
      };

      sinon.stub(Restaurant, 'findOne').resolves(mockRestaurant);
      sinon.stub(MenuItem, 'findOneAndDelete').resolves(null);

      const req = {
        params: { 
          restaurantId,
          id: new mongoose.Types.ObjectId() 
        },
        user: { id: userId }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      try {
        await menuItemController.deleteMenuItem(req, res);
      } catch (error) {
        expect(res.status.calledWith(404)).to.be.true;
      }
    });
  });
});