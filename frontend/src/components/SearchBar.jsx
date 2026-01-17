import InputBox from './InputBox';

export default function SearchBar({ setIsSearchActive, searchQuery, setSearchQuery, ...props }) {

  return (
    <InputBox
      parentClassName={'flex-1'}
      onFocus={(event) => {
        setIsSearchActive(() => true);
      }}
      value={searchQuery}
      setValue={setSearchQuery}
      placeholder="Search for counselors, topics..."
      placeholderTextColor="#9CA3AF"
      icon={'search'}
      showClearBtn={true}
      onBlur={() => {
        setIsSearchActive(false);
      }}
      {...props}
    />
  );
}
