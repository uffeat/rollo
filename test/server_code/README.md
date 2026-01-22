# About

Replicates central parts of companion apps' server code for testing of server code without the need to commit and with live logging.

# Note

Replica is manually maintained; not ideal, but a very worthwhile tradeoff compared to testing server code blindly and commiting at each test cycle.

Did consider creating a custom cross-repo transfer tool. However, such a tool would be complicated by:
- Actual server code has a slightly different import syntax than standard Python (Uplink code).
- Some server features are only available in actual server code (not Uplink servers).
