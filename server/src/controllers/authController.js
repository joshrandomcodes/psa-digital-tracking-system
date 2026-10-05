const db = require('../config/db'); // Adjust this path if your db connection file is located elsewhere
const jwt = require('jsonwebtoken');

// Secret key for signing tokens (keep hardcoded for prototype purposes)
const SECRET_KEY = 'psa_prototype_secret_key'; 

const login = async (req, res) => {
  const { isStaff, email, employeeId, password } = req.body;
  
  try {
    if (isStaff) {
      // Authenticate PSA Staff
      const [staff] = await db.execute(
        'SELECT StaffID, Role, FirstName, LastName, OfficeCode FROM PSA_STAFF WHERE EmployeeID = ? AND PasswordHash = SHA2(?, 256)',
        [employeeId, password]
      );
      
      if (staff.length === 0) {
        return res.status(401).json({ error: 'Invalid Employee ID or Password.' });
      }
      
      const user = { 
        id: staff[0].StaffID, 
        role: staff[0].Role, 
        name: `${staff[0].FirstName} ${staff[0].LastName}`, 
        officeCode: staff[0].OfficeCode 
      };
      
      const token = jwt.sign(user, SECRET_KEY, { expiresIn: '8h' });
      return res.json({ token, user });
      
    } else {
      // Authenticate Citizen Applicant
      const [citizen] = await db.execute(
        'SELECT CitizenID, FirstName, LastName FROM CITIZEN WHERE Email = ? AND PasswordHash = SHA2(?, 256)',
        [email, password]
      );
      
      if (citizen.length === 0) {
        return res.status(401).json({ error: 'Invalid Email or Password.' });
      }
      
      const user = { 
        id: citizen[0].CitizenID, 
        role: 'citizen', 
        name: `${citizen[0].FirstName} ${citizen[0].LastName}` 
      };
      
      const token = jwt.sign(user, SECRET_KEY, { expiresIn: '8h' });
      return res.json({ token, user });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

const register = async (req, res) => {
  const { philSysId, firstName, lastName, email, password } = req.body;
  
  try {
    // Prevent duplicate registrations
    const [existing] = await db.execute(
      'SELECT CitizenID FROM CITIZEN WHERE PhilSysID = ? OR Email = ?', 
      [philSysId, email]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this PhilSys ID or Email already exists.' });
    }

    // Insert new citizen using SHA256 password hashing
    const [result] = await db.execute(
      'INSERT INTO CITIZEN (PhilSysID, FirstName, LastName, Email, PasswordHash) VALUES (?, ?, ?, ?, SHA2(?, 256))',
      [philSysId, firstName, lastName, email, password]
    );
    
    const user = { 
      id: result.insertId, 
      role: 'citizen', 
      name: `${firstName} ${lastName}` 
    };
    
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '8h' });
    res.status(201).json({ token, user });
    
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

module.exports = { login, register };