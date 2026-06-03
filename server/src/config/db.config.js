import mongoose from "mongoose";
import User from "../models/User.model.js";
import History from "../models/History.model.js";

const mockDbStore = {
  User: [],
  History: []
};

class MockQuery {
  constructor(result) {
    this.result = result;
  }
  select() { return this; }
  sort() {
    if (Array.isArray(this.result)) {
      this.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return this;
  }
  then(onFulfilled, onRejected) {
    return Promise.resolve(this.result).then(onFulfilled, onRejected);
  }
}

const setupMockDB = () => {
  User.findOne = async function (query) {
    const store = mockDbStore.User;
    const found = store.find((item) => {
      for (let key in query) {
        if (String(item[key]) !== String(query[key])) return false;
      }
      return true;
    });
    return found ? found : null;
  };

  User.create = async function (doc) {
    const store = mockDbStore.User;
    const newDoc = {
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      picture: "",
      ...doc
    };
    newDoc.save = async function() {
      const idx = store.findIndex(item => String(item._id) === String(this._id));
      if (idx !== -1) store[idx] = this;
      return this;
    };
    store.push(newDoc);
    return newDoc;
  };

  User.findById = function (id) {
    const store = mockDbStore.User;
    const found = store.find((item) => String(item._id) === String(id));
    return new MockQuery(found || null);
  };

  History.create = async function (doc) {
    const store = mockDbStore.History;
    const newDoc = {
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...doc
    };
    store.push(newDoc);
    return newDoc;
  };

  History.find = function (query) {
    const store = mockDbStore.History;
    const results = store.filter((item) => {
      for (let key in query) {
        if (String(item[key]) !== String(query[key])) return false;
      }
      return true;
    });
    return new MockQuery([...results]);
  };

  History.findOneAndDelete = async function (query) {
    const store = mockDbStore.History;
    const idx = store.findIndex((item) => {
      for (let key in query) {
        if (String(item[key]) !== String(query[key])) return false;
      }
      return true;
    });
    if (idx === -1) return null;
    const deleted = store.splice(idx, 1)[0];
    return deleted;
  };

  History.deleteMany = async function (query) {
    const store = mockDbStore.History;
    let deletedCount = 0;
    for (let i = store.length - 1; i >= 0; i--) {
      const item = store[i];
      let match = true;
      for (let key in query) {
        if (String(item[key]) !== String(query[key])) match = false;
      }
      if (match) {
        store.splice(i, 1);
        deletedCount++;
      }
    }
    return { deletedCount };
  };
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in your .env file");
    }
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.warn(`Database connection failed: ${error.message}`);
    console.warn("Falling back to IN-MEMORY DATABASE MOCK.");
    setupMockDB();
  }
};

export default connectDB;
