const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  let total = blogs.reduce((v, {likes}) => v + likes, 0);
  return total;
}

module.exports = {
  dummy,
  totalLikes
}