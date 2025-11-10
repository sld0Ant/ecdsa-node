function Stats({ users }) {
  return (
    <div className="container wallet">
      <h1>Stats</h1>

      <div className="balance">
        <div className="userList">
          {users.map((user) => {
            return (
              <div>
                <div>{user.id}</div>
                <div>{user.balance}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Stats;
