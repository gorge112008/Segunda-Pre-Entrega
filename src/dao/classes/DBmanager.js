import { productsModel } from "../models/products.model.js";
import { cartsModel } from "../models/carts.model.js";
import { messagesModel } from "../models/messages.model.js";
import { userModel } from "../models/users.model.js";

/*********************************************************PRODUCTS*************************************************************/

class ProductFileManager {
  async getProducts() {
    try {
      const products = await productsModel.find();
      return products;
    } catch (err) {
      throw err;
    }
  }
  async getProductId(id) {
    try {
      const product = await productsModel.find({ _id: id });
      return product;
    } catch (err) {
      throw err;
    }
  }
  async addProduct(newProduct) {
    try {
      const product = await productsModel.create(newProduct);
      return product;
    } catch (err) {
      throw err;
    }
  }
  async updateProduct(id, body) {
    try {
      const product = await productsModel.findOneAndUpdate({ _id: id }, body, {
        new: true,
        upsert: true,
      });
      return product;
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(id) {
    try {
      await productsModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw err;
    }
  }
}

/*********************************************************CARTS*************************************************************/

class CartFileManager {
  async getCarts() {
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (err) {
      throw err;
    }
  }
  async getCartId(id) {
    try {
      const cart = await cartsModel.find({ _id: id });
      return cart;
    } catch (err) {
      throw err;
    }
  }
  async addCart(newProduct) {
    try {
      const cart = await cartsModel.create(newProduct);
      return cart;
    } catch (err) {
      throw err;
    }
  }
  async updateCart(id, body) {
    try {
      const cart = await cartsModel.findOneAndUpdate({ _id: id }, body, {
        new: true,
        upsert: true,
      });
      return cart;
    } catch (err) {
      throw err;
    }
  }

  async deleteCart(id) {
    try {
      await cartsModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw err;
    }
  }
}

/*********************************************************MESSAGES*************************************************************/

class MessageFileManager {
  async getMessages() {
    try {
      const messages = await messagesModel.find();
      return messages;
    } catch (err) {
      throw err;
    }
  }
  async getMessageId(id) {
    try {
      const message = await messagesModel.find({ _id: id });
      return message;
    } catch (err) {
      throw err;
    }
  }
  async addMessage(newMessage) {
    try {
      const message = await messagesModel.create(newMessage);
      return message;
    } catch (err) {
      throw err;
    }
  }
  async updateMessage(id, body) {
    try {
      const message = await messagesModel.findOneAndUpdate({ _id: id }, body, {
        new: true,
        upsert: true,
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteMessage(id) {
    try {
      await messagesModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw err;
    }
  }
}

/*********************************************************USERS*************************************************************/

class UserFileManager {
  async getUsers() {
    try {
      const Users = await userModel.find();
      return Users;
    } catch (err) {
      throw err;
    }
  }
  async getUserId(id) {
    try {
      const User = await userModel.find({ _id: id });
      return User;
    } catch (err) {
      throw err;
    }
  }
  async addUser(newUser) {
    try {
      const User = await userModel.create(newUser);
      return User;
    } catch (err) {
      throw err;
    }
  }
  async updateUser(id, body) {
    try { 
      const User = await userModel.findOneAndUpdate({_id: id}, body, {
        new: true,
        upsert: true,
      });
      return User;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id) {
    try {
      await userModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw err;
    }
  }
}

/*********************************************************EXPORTS*************************************************************/

export const ProductFM = new ProductFileManager();
export const CartFM = new CartFileManager();
export const MessageFM = new MessageFileManager();
export const UserFM = new UserFileManager();
