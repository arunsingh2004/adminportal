import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import { query } from "../../../lib/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  // let session = true;

  if (session) {
    const { type } = req.query;
    try {
      let params = req.body;

      if (session.user.role == 1 || session.user.role == 2) {
        if (session.user.role == 1 && type == "user") {
          let result = await query(
            `INSERT INTO users (name,email,role,department,designation,ext_no,research_interest) values (` +
              `?,?,?,?,?,?,?)`,
            [
              params.name,
              params.email,
              params.role,
              params.department,
              params.designation,
              params.ext_no,
              params.research_interest,
            ]
          );
          return res.json(result);
        } else if (type == "notice") {
          params.attachments = JSON.stringify(params.attachments);
          let result = await query(
            `INSERT INTO notices (id,title,timestamp,openDate,closeDate,important,attachments,email,isVisible) VALUES ` +
              `(?,?,?,?,?,?,?,?,?)`,
            [
              params.id,
              params.title,
              params.timestamp,
              params.openDate,
              params.closeDate,
              params.important,
              params.attachments,
              params.email,
              params.isVisible,
            ]
          );
          return res.json(result);
        } else if (type == "event") {
          params.attachments = JSON.stringify(params.attachments);
          let result = await query(
            `INSERT INTO events (id,title,timestamp,openDate,closeDate,venue,doclink,attachments,email) VALUES ` +
              `(?,?,?,?,?,?,?,?,?)`,
            [
              params.id,
              params.title,
              params.timestamp,
              params.openDate,
              params.closeDate,
              params.venue,
              params.doclink,
              params.attachments,
              params.email,
            ]
          );
          return res.json(result);
        } else if (type == "innovation") {
          params.image = JSON.stringify(params.image);
          let result = await query(
            `INSERT INTO innovation (id,title,timestamp,openDate,closeDate,description,image,author,email) VALUES ` +
              `(?,?,?,?,?,?,?,?,?)`,
            [
              params.id,
              params.title,
              params.timestamp,
              params.openDate,
              params.closeDate,
              params.description,
              params.image,
              params.author,
              params.email,
            ]
          );
          return res.json(result);
        } else if (type == "news") {
          params.image = JSON.stringify(params.image);
          let result = await query(
            `INSERT INTO news (id,title,timestamp,openDate,closeDate,description,image,author,email) VALUES ` +
              `(?,?,?,?,?,?,?,?,?)`,
            [
              params.id,
              params.title,
              params.timestamp,
              params.openDate,
              params.closeDate,
              params.description,
              params.image,
              params.author,
              params.email,
            ]
          );
          return res.json(result);
        }
      }
      if (session.user.email == params.email) {
        if (type == "image") {
          // let result = await query(
          //   `REPLACE INTO users (email,image) values (`+
          //     `'${params.email}','${params.image[0].url}')`
          // );
          let result = await query(
            `UPDATE users SET	image='${params.image[0].url}' WHERE email='${params.email}'`
          );
          return res.json(result);
        } else if (type == "current-responsibility") {
          let result = await query(
            `INSERT INTO curr_admin_responsibility (id,email,curr_responsibility) VALUES` +
              `(?,?,?)`,
            [params.id, params.email, params.curr_responsibility]
          );
          return res.json(result);
        } else if (type == "memberships") {
          let result = await query(
            `insert into memberships (id,email,membership_id,membership_society) values (` +
              `?,?,?,?)`,
            [
              params.id,
              params.email,
              params.membership_id,
              params.membership_society,
            ]
          );
          return res.json(result);
        } else if (type == "past-responsibility") {
          let result = await query(
            `INSERT INTO past_admin_responsibility (id,email,past_responsibility) VALUES` +
              `(?,?,?)`,
            [params.id, params.email, params.past_responsibility]
          );
          return res.json(result);
        } else if (type == "workexperience") {
          let result = await query(
            `INSERT INTO work_experience (id,email,work_experiences) VALUES` +
              `(?,?,?)`,
            [params.id, params.email, params.work_experiences]
          );
          return res.json(result);
        } else if (type == "subjects") {
          let result = await query(
            `INSERT INTO subjects_teaching (id,email,subject) VALUES` +
              `(?,?,?)`,
            [params.id, params.email, params.subject]
          ).catch((e) => {
            console.log(e);
          });
          return res.json(result);
        } else if (type == "publications") {
          let result = await query(
            `INSERT INTO publications (id,email,publications) VALUES` +
              `(?,?,?)`,
            [params.id, params.email, params.publications]
          );
          return res.json(result);
        } else if (type == "project") {
          let result = await query(
            `INSERT INTO project (id,email,project) VALUES` + `(?,?,?)`,
            [params.id, params.email, params.project]
          );
          return res.json(result);
        } else if (type == "professionalservice") {
          let result = await query(
            `INSERT INTO professional_service (id,email,services) VALUES` +
              `(?,?,?)`,
            [params.id, params.email, params.services]
          );
          return res.json(result);
        } else if (type == "education") {
          let result = await query(
            `INSERT INTO education (id,email,certification,institution,passing_year) VALUES` +
              `(?,?,?,?,?)`,
            [
              params.id,
              params.email,
              params.certification,
              params.institution,
              params.passing_year,
            ]
          );
          return res.json(result);
        } else if (type == "phdcandidates") {
          let result = await query(
            `INSERT INTO phd_candidates (id,email,phd_student_name,thesis_topic,start_year,completion_year) VALUES` +
              `(?,?,?,?,?,?)`,
            [
              params.id,
              params.email,
              params.phd_student_name,
              params.thesis_topic,
              params.start_year,
              params.completion_year,
            ]
          );
          return res.json(result);
        }
      } else {
        return res.json({ message: "Could not find matching requests" });
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(403).json({ message: "You are not authorized" });
  }
};

export default handler;